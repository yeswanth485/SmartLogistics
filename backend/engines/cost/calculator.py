from backend.core.config import settings
from backend.engines.pack.bin_packer import Box

class CostEngine:
    @staticmethod
    def calculate_cost(box: Box) -> tuple[float, float]:
        """
        Calculates chargeable weight and total shipping cost.
        Chargeable weight is max(Actual Weight, Volumetric Weight).
        """
        actual_weight = box.current_weight
        # Volume in cm3, assume dimensions are cm for MVP
        volumetric_weight = box.volume / settings.VOLUMETRIC_DIVISOR
        
        chargeable_weight = max(actual_weight, volumetric_weight)
        
        # Simple cost function: base_cost + (chargeable_weight * factor)
        # e.g., $5 base + $2 per kg
        shipping_cost = box.base_cost + (chargeable_weight * 2.0)
        
        return chargeable_weight, shipping_cost
