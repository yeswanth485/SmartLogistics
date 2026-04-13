import random
from typing import List, Tuple
from copy import deepcopy

from backend.engines.pack.bin_packer import Item, Box, BinPacker
from backend.engines.cost.calculator import CostEngine

class GeneticOptimizer:
    def __init__(self, items: List[Item], template_boxes: List[Box], pop_size=30, generations=20):
        self.items = items
        self.template_boxes = template_boxes
        self.pop_size = pop_size
        self.generations = generations

    def fitness(self, permutation: List[Item], box: Box) -> float:
        packed_box = BinPacker.pack(permutation, box)
        
        if packed_box.current_weight == float('inf'):
            # Invalid packing (could not fit all items)
            return -999999.0
            
        _, cost = CostEngine.calculate_cost(packed_box)
        # We want to minimize cost and maximize utilization
        # Higher fitness is better
        return (packed_box.utilization * 100) - cost

    def create_population(self) -> List[List[Item]]:
        pop = []
        for _ in range(self.pop_size):
            perm = deepcopy(self.items)
            random.shuffle(perm)
            pop.append(perm)
        return pop

    def pmx_crossover(self, parent1: List[Item], parent2: List[Item]) -> List[Item]:
        # Partially Mapped Crossover for permutation
        size = len(parent1)
        if size <= 1:
            return deepcopy(parent1)
        p1, p2 = random.sample(range(size), 2)
        start, end = min(p1, p2), max(p1, p2)
        
        child = [None] * size
        child[start:end] = parent1[start:end]
        
        for i in range(start, end):
            if parent2[i] not in child:
                j = parent2.index(parent1[i])
                while child[j] is not None:
                    j = parent2.index(parent1[j])
                child[j] = parent2[i]
                
        for i in range(size):
            if child[i] is None:
                child[i] = parent2[i]
                
        return child

    def mutate(self, permutation: List[Item], rate=0.1) -> List[Item]:
        if random.random() < rate and len(permutation) > 1:
            idx1, idx2 = random.sample(range(len(permutation)), 2)
            permutation[idx1], permutation[idx2] = permutation[idx2], permutation[idx1]
        return permutation

    def optimize(self) -> Tuple[Box, float, float]:
        """
        Runs GA across available boxes and returns the best packed Box.
        """
        best_overall_box = None
        best_overall_fitness = -float('inf')
        
        for t_box in self.template_boxes:
            population = self.create_population()
            
            best_local_box = None
            best_local_fitness = -float('inf')
            
            for _ in range(self.generations):
                # Evaluate fitness
                fitness_scores = []
                for p in population:
                    fit = self.fitness(p, t_box)
                    fitness_scores.append((fit, p))
                
                # Sort by fitness descending
                fitness_scores.sort(key=lambda x: x[0], reverse=True)
                
                if fitness_scores[0][0] > best_local_fitness:
                    best_local_fitness = fitness_scores[0][0]
                    best_local_box = BinPacker.pack(fitness_scores[0][1], t_box)
                
                # Selection & Crossover (Elitism)
                next_gen = [fitness_scores[0][1], fitness_scores[1][1]]
                
                while len(next_gen) < self.pop_size:
                    p1 = random.choice(fitness_scores[:10])[1] # tournament from top 10
                    p2 = random.choice(fitness_scores[:10])[1]
                    child = self.pmx_crossover(p1, p2)
                    child = self.mutate(child)
                    next_gen.append(child)
                    
                population = next_gen
                
            if best_local_fitness > best_overall_fitness and best_local_fitness != -999999.0:
                best_overall_fitness = best_local_fitness
                best_overall_box = best_local_box

        if not best_overall_box:
            raise ValueError("Could not fit items in any of the provided boxes.")
            
        return best_overall_box
