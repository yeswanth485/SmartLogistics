import copy
import uuid
from typing import List, Dict, Any

class Item:
    def __init__(self, name: str, length: float, width: float, height: float, weight: float, item_id: str = None):
        self.id = item_id or str(uuid.uuid4())
        self.name = name
        self.dimensions = [length, width, height]
        self.weight = weight

    def __eq__(self, other):
        if not isinstance(other, Item): return False
        return self.id == other.id
        
    def __hash__(self):
        return hash(self.id)

    @property
    def volume(self) -> float:
        return self.dimensions[0] * self.dimensions[1] * self.dimensions[2]

    def get_rotations(self):
        # 6 possible orthogonal rotations
        l, w, h = self.dimensions
        return [
            (l, w, h),
            (l, h, w),
            (w, l, h),
            (w, h, l),
            (h, l, w),
            (h, w, l)
        ]

class Space:
    def __init__(self, x: float, y: float, z: float, l: float, w: float, h: float):
        self.x = x
        self.y = y
        self.z = z
        self.l = l
        self.w = w
        self.h = h

class Box:
    def __init__(self, name: str, length: float, width: float, height: float, max_weight: float, base_cost: float = 0.0):
        self.name = name
        self.l = length
        self.w = width
        self.h = height
        self.max_weight = max_weight
        self.base_cost = base_cost
        
        self.items: List[Dict[str, Any]] = []
        self.spaces: List[Space] = [Space(0, 0, 0, length, width, height)]
        self.current_weight = 0.0

    @property
    def volume(self) -> float:
        return self.l * self.w * self.h

    @property
    def utilization(self) -> float:
        used_volume = sum(item['length'] * item['width'] * item['height'] for item in self.items)
        return used_volume / self.volume if self.volume > 0 else 0

    def can_fit(self, extents, space: Space) -> bool:
        el, ew, eh = extents
        return el <= space.l and ew <= space.w and eh <= space.h

    def place_item(self, item: Item) -> bool:
        if self.current_weight + item.weight > self.max_weight:
            return False

        # Sort spaces by z, y, x to favor bottom-left-back packing
        self.spaces.sort(key=lambda s: (s.z, s.y, s.x))

        for space in self.spaces:
            for rot in item.get_rotations():
                if self.can_fit(rot, space):
                    # Place here
                    self.items.append({
                        "product_name": item.name,
                        "x": space.x,
                        "y": space.y,
                        "z": space.z,
                        "length": rot[0],
                        "width": rot[1],
                        "height": rot[2]
                    })
                    self.current_weight += item.weight
                    self.split_space(space, rot)
                    return True
        return False

    def split_space(self, original_space: Space, item_dimensions) -> None:
        il, iw, ih = item_dimensions
        
        # We generate up to 3 new spaces: Right, Top, Front
        new_spaces = []
        
        # Space to the Right (along X)
        if original_space.l - il > 0:
            new_spaces.append(Space(
                original_space.x + il,
                original_space.y,
                original_space.z,
                original_space.l - il,
                iw, # or original_space.w (heuristics differ, we do simple division)
                ih
            ))
            
        # Space to the Front (along Y)
        if original_space.w - iw > 0:
            new_spaces.append(Space(
                original_space.x,
                original_space.y + iw,
                original_space.z,
                original_space.l,
                original_space.w - iw,
                ih
            ))
            
        # Space to the Top (along Z)
        if original_space.h - ih > 0:
            new_spaces.append(Space(
                original_space.x,
                original_space.y,
                original_space.z + ih,
                original_space.l,
                original_space.w,
                original_space.h - ih
            ))

        self.spaces.remove(original_space)
        self.spaces.extend(new_spaces)
        
        # In a full robust implementation, we would perform space merge & overlap resolution.
        # This MVP splits correctly for simple FFD packing.

class BinPacker:
    @staticmethod
    def pack(items: List[Item], template_box: Box) -> Box:
        box = copy.deepcopy(template_box)
        for item in items:
            success = box.place_item(item)
            if not success:
                # For MVP, if it fails to pack one item, we consider the whole permutation invalid (or partial).
                # To heavily penalize not fitting all items:
                box.current_weight = float("inf") # Marks as invalid box
                return box
        return box
