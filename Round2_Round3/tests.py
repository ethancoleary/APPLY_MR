from otree.api import *
from . import *
import random

class PlayerBot(Bot):


    def play_round(self):
        # Provide responses for the main survey

        yield Task_instructions
        yield Piece_rate_explanation
        yield Piece_rate_stage, {
            'Piece_rate': random.randint(0, 50)
        }
        yield Piece_rate_feedback
        yield Tournament_explanation
        yield Tournament_stage,{
            'Tournament': random.randint(0, 50)
        }
        yield Tournament_rate_feedback
        
        yield Choice_stage_1_explanation
        yield Choice_stage_1, {'Competitiveness_1': random.randint(0, 100),
                               'Competitiveness_1_list': random.randint(0, 100),}
        yield Choice_stage_1_play,{
            'Choice_stage_1': random.randint(0, 50),
        }
        yield Choice1_feedback
        yield Beliefs_1_OC,{
            'Overconfidence': random.randint(1, 6)
        }
        yield Beliefs_1_FOB, {
            'FOB_Male_score': random.randint(0, 50),
            'FOB_Female_score': random.randint(0, 50),
            'FOB_Male_score_list': random.randint(0, 50),
            'FOB_Female_score_list': random.randint(0, 50),
        }
        yield Beliefs_1_SOB,{
            'SOB_Male_score': random.randint(0, 50),
            'SOB_Female_score': random.randint(0, 50),
            'SOB_Male_score_list': random.randint(0, 50),
            'SOB_Female_score_list': random.randint(0, 50),
        }
        yield Belief_information
        yield Choice_stage_2,{
            'Choice_stage_2_read_info': 0,
            'Competitiveness_2': random.randint(0, 100),
            'Competitiveness_2_list': random.randint(0, 100),
        }
        yield Choice_stage_2_play, {
            'Choice_stage_2': random.randint(0, 50),
        }
        yield Choice2_feedback
        
        yield Attention_check_2,{
            'Attention_2': 1
        }
        yield Beliefs_2_FOB,{
            'FOB_Male_score_2': random.randint(0, 50),
'FOB_Female_score_2': random.randint(0, 50),
'FOB_Male_score_2_list': random.randint(0, 50),
'FOB_Female_score_2_list': random.randint(0, 50),
        }
        yield Beliefs_2_SOB,{
                        'SOB_Male_score_2': random.randint(0, 50),
'SOB_Female_score_2': random.randint(0, 50),
'SOB_Male_score_2_list': random.randint(0, 50),
'SOB_Female_score_2_list': random.randint(0, 50),
        }
        yield Beliefs_2_OC,{
            'Overconfidence_2': random.randint(1, 6)
        }
        yield Choice_stage_3,{
                        'Competitiveness_3': random.randint(0, 100),
            'Competitiveness_3_list': random.randint(0, 100),
        }
        yield FinishMain
        yield Attribution,{
            'Attribution': random.randint(0, 50),
        }

    

    # Optionally define any helper methods here if needed for complex operations
