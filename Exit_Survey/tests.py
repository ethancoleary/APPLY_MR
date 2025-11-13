from otree.api import *
from . import *
import random

class PlayerBot(Bot):

    def play_round(self):
        # Assuming the bot is allowed to view the page

        # Provide responses for the exit survey
        yield Risk_aversion, {
            'switching_point': random.choice(range(25, 80, 5))
        }

        # Provide responses for the pilot survey (only if it's a pilot test)
        yield Gender_continuous, {
            'Gender_continuous': 3
        }
        
        yield Stereotype, {
            'Stereotype_math_man': '3',
            'Stereotype_memory_man': '3',
            'Stereotype_math_woman': '3',
            'Stereotype_memory_woman': '3',            
        }

    # Optionally define any helper methods here if needed for complex operations
