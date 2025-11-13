# common.py

from otree.api import Page
from otree.api import BaseConstants
from otree.api import  models, widgets
import json

# %% Functions
def get_treatment_part(part, player):
    'returns the part of the treatment that is relevant for the player'
    'i.e. if treatment="T1_Math_men" and part=1, it returns "Math"'
    # print(player.participant.Treatment)
    return player.participant.Treatmentstring.split('_')[part]



def determine_rank(player, round): 
    assert round in ['Piece_rate', 'Tournament', 'Choice_stage_1', 'Choice_stage_2', 'Choice_stage_3',]
    # i have a str version of the list of group members, turn it back to a list
    Group_members = player.participant.Group_members   
    if round == 'Choice_stage_2':
        # player 2's performance in choice_stage_2 is compared to opponents' performance in choice_stage_1
        player_score = player.Choice_stage_2
        opponents = [player.group.get_player_by_id(id) for id in Group_members] 
        opponents_scores = [opponent.Choice_stage_1 for opponent in opponents]
    elif round == 'Choice_stage_3':
        # players performance in choice_stage_2 is compared to a random performance of a participant with opposite gender in choice_stage_2
        player_score = player.Choice_stage_2
        opponents = [player.group.get_player_by_id(id) for id in Group_members] 
        opponent = random.choice([opponent for opponent in opponents if opponent.participant.Gender!=player.participant.Gender ]) 
        opponents_scores = [opponent.Choice_stage_2]
    else:
        player_score = getattr(player, f'{round}')
        opponents = [player.group.get_player_by_id(id) for id in Group_members] 
        opponents_scores = [getattr(opponent, f'{round}') for opponent in opponents]
    
    # return players rank among the group
    rank = 1 + sum([getattr(player, f'{round}') < score for score in opponents_scores])

    return rank
    
def calculate_bonus(player):    
    '''
    calculates the bonus for the player
    1. chooses one of the rounds randomly
        - there are 7 rounds. 
            - R1: Piece-rate; R2: Tournament; R3: Choice stage 1; R4: Choice stage 2;
                R5: Choice stage 3; R6: Beliefs 1; R7: Beliefs 2
    2. calculates the bonus based on the chosen round
    3. saves the randomly chosen round and the bonus to the participant fields
    '''
    Group_members = player.participant.Group_members
  
    bonus_relevant_round = random.choice(['Piece_rate', 'Tournament', 'Choice_stage_1', 'Choice_stage_2', 'Choice_stage_3', 'Beliefs_1', 'Beliefs_2'])
    bonus = 0
    if bonus_relevant_round == 'Piece_rate':
        bonus = player.Piece_rate * C.Piece_rate
    elif bonus_relevant_round == 'Tournament':
        if determine_rank(player, 'Tournament')==1:
            bonus = player.Tournament * C.Tournament_rate
    elif bonus_relevant_round == 'Choice_stage_1':
        bonus = (100 - player.Competitiveness_1) * (player.Choice_stage_1 * C.Piece_rate) / 100
        if determine_rank(player, 'Choice_stage_1')==1: 
            bonus = bonus + player.Competitiveness_1 * (player.Choice_stage_1 * C.Tournament_rate) /100
    elif bonus_relevant_round == 'Choice_stage_2':
        bonus = (100 - player.Competitiveness_2) * (player.Choice_stage_2 * C.Piece_rate) /100
        if determine_rank(player, 'Choice_stage_2')==1: 
            bonus = bonus + player.Competitiveness_2 * (player.Choice_stage_2 * C.Tournament_rate) /100
    elif bonus_relevant_round == 'Choice_stage_3':
        bonus = (100 - player.Competitiveness_3) * (player.Choice_stage_2 * C.Piece_rate) /100
        if determine_rank(player, 'Choice_stage_2')==1: 
            bonus = bonus + player.Competitiveness_3 * (player.Choice_stage_2 * C.Tournament_rate_2) /100
    
    
    elif bonus_relevant_round == 'Beliefs_1' or bonus_relevant_round == 'Beliefs_2':
        bonus_relevant_round = random.choice(['FOB_Male_score', 'FOB_Female_score', 'SOB_Male_score', 'SOB_Female_score', 'Overconfidence',
                                              'FOB_Male_score_2', 'FOB_Female_score_2', 'SOB_Male_score_2', 'SOB_Female_score_2', 'Overconfidence_2'
                                              ])
        
        other_players = [pl for pl in player.subsession.get_players() if pl!=player]
        all_players = [pl for pl in player.subsession.get_players()]
        
        if bonus_relevant_round == 'Overconfidence':
            if player.Overconfidence == determine_rank(player,'Tournament'):
                bonus = C.Max_Bonus
        elif bonus_relevant_round == 'Overconfidence_2':
            if player.Overconfidence_2 == determine_rank(player,'Choice_stage_2'):
                bonus = C.Max_Bonus
        
        elif 'FOB' in bonus_relevant_round:
            if 'Female' in bonus_relevant_round:
                Belief_correct = np.mean([getattr(player, f'Piece_rate') for player in all_players if player.participant.Gender == 'Female'])
            elif 'Male' in bonus_relevant_round:
                try:
                    Belief_correct = np.mean([getattr(player, f'Piece_rate') for player in all_players if player.participant.Gender == 'Male'])
                except:
                    Belief_correct = np.mean([getattr(player, f'Piece_rate') for player in all_players])
            if getattr(player, f'{bonus_relevant_round}') <= Belief_correct * 1.1 and getattr(player, f'{bonus_relevant_round}') >= Belief_correct * 0.9:
                bonus = C.Max_Bonus
            
        elif 'SOB' in bonus_relevant_round:
            attribute_to_get = bonus_relevant_round.replace('SOB', 'FOB')
            Belief_correct = np.mean([getattr(player, attribute_to_get) for player in all_players])
            if getattr(player, f'{bonus_relevant_round}') <= Belief_correct * 1.1 and getattr(player, f'{bonus_relevant_round}') >= Belief_correct * 0.9:
                bonus = C.Max_Bonus      
        
        else:
            Belief_correct = np.mean([getattr(player, f'{bonus_relevant_round}') for player in other_players])
            if getattr(player, f'{bonus_relevant_round}') <= Belief_correct*1.1 and player.FOB_Female_score >= Belief_correct*0.9:
                bonus = C.Max_Bonus  
                
    bonus = max(0, bonus)
    
    return bonus_relevant_round, bonus


# %% Constants
class CommonConstants(BaseConstants):
    Completion_fee = 3.50
    Max_Bonus = 10  

    Piece_rate = 0.05
    Tournament_rate1 = 4

    Recruiter_Treatments = {3, 4, 5, 8, 11, 12, 13, 16}

    
    # Prolific links:
    Completion_redirect = "https://www.wikipedia.org/" #TODO: adjust completion redirect
    Reject_redirect = "https://www.wikipedia.org/" #TODO: adjust reject redirect
    Return_redirect = "https://www.wikipedia.org/" #TODO: adjust return redirect
    
    Instructions_Manager_MM_path = "_templates/global/Instructions_Manager_MM.html"
    Instructions_Manager_ER_path = "_templates/global/Instructions_Manager_ER.html"

    Task_instructions_path = "_templates/global/Task_instructions.html"
    Task_instructions_MM_path = "_templates/global/Task_instructions_MM.html"
    Task_instructions_ER_path = "_templates/global/Task_instructions_ER.html"

RECRUITER_TREATMENTS = set(CommonConstants.Recruiter_Treatments)

# %% Player
# DOESNT WORK WITH PLAYER

# %% Pages
class MyBasePage(Page):
    form_model = 'player'
    form_fields = ['blur_log', 'blur_count', 'blur_warned']


    @staticmethod
    def vars_for_template(player):
 # --- Instructions path logic (updated) ---
        # Use neutral instructions if treatment hides gender (1 or 9).





       # if player.participant.Gender == '':
        #    Instructions_path = CommonConstants.Instructions_female_path
        #elif player.participant.Gender == 'Male':
         #       Instructions_path = CommonConstants.Instructions_male_path
        #else: Instructions_path = CommonConstants.Instructions_female_path

        if player.participant.Treatment > 8:
            Task_path = CommonConstants.Task_instructions_ER_path
            Instructions_path = CommonConstants.Instructions_Manager_ER_path
        else:
            Task_path = CommonConstants.Task_instructions_MM_path
            Instructions_path = CommonConstants.Instructions_Manager_MM_path
        
        piece_rate = CommonConstants.Piece_rate
        tournament_rate1 = CommonConstants.Tournament_rate1 * piece_rate

        if player.participant.Blur_warned == 1:
            player.blur_warned = 1

        if player.participant.Treatment < 9:
            task = "Maths-Memory"
        else:
            task = "Emotion Recognition"
            

        return {
            'hidden_fields': ['blur_log', 'blur_count','blur_warned'],
            'Completion_fee': CommonConstants.Completion_fee,
            
            'Instructions_path': Instructions_path,
            'Task_path': Task_path,
            'Task_instructions': Task_path,
            'MathMemory': get_treatment_part(1, player),
            'task': task,
            'Skill': get_treatment_part(1, player).lower(),

            'piece_rate': "{:.2f}".format(piece_rate),
            'tournament_rate1': "{:.2f}".format(tournament_rate1),

        }
        
        
                   

    @staticmethod
    def before_next_page(player, timeout_happened=False):
        blob = player.blur_log or '{}'
        page_counts = json.loads(blob)
        Blur_log = player.participant.vars.get('Blur_log', {})
        for page_name, count in page_counts.items():
            Blur_log[page_name] = Blur_log.get(page_name, 0) + count
        player.participant.vars['Blur_log'] = Blur_log
        player.participant.vars['Blur_count'] = (
            player.participant.vars.get('Blur_count', 0)
            + (player.blur_count or 0))
        
        # if player has been warned in this page, we set the flag and keep track of it, if not we keep the previous value
        # TODO: decide if you want the bonus to be determined based on the blur_warned flag, if so, adjust your bonus logic accordingly
        if player.blur_warned:
            player.participant.Blur_warned = 1
        
