from . import *
import random

class PlayerBot(Bot):


    def play_round(self):
        case = self.case

        # Assume demographics data is fixed for simplicity
        yield Consent
        yield Demographics, {
            'age': random.randint(18, 70),
            'gender': random.choice(['Male', 'Female',]),
            'education': random.choice(['Bachelors']),
            'employment': random.choice(['Employed full-time', 'Student', 'Out of work, or seeking work']),
            'income': random.choice(['0 - 25.000 $',]),
            'field_of_study': 'Economics',
            'year_of_study': '1st year',
        }
        yield Instructions

        yield Comprehension_check_1, {
            'Comprehension_question_1': True,
            'Comprehension_question_2': True,
            'Comprehension_question_3': True
        }
        



    # Optionally define any helper methods here if needed for complex operations
