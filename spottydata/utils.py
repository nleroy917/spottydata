import sys
import json

def key_int_to_str(key: int) -> str:
    """
    Convert spotify's 'pitch class notation' to
    and actual key value
    """
    switcher = {
        "0": "C",
        "1": "C#",
        "2": "D",
        "3": "D#",
        "4": "E",
        "5": "F",
        "6": "F#",
        "7": "G",
        "8": "G#",
        "9": "A",
        "10": "A#",
        "11": "B"
    }
    return switcher.get(str(key), "No key")

def mode_int_to_mode(key: int) -> str:
    switcher = {
        "0": "Minor",
        "1": "Major"
    }
    return switcher.get(str(key), "No mode")

def meta_analysis(analysis: dict) -> None:
    """
    Generate a meta-profile of the analysis package
    with data on size and memory footprint
    """
    for feature in analysis:
        size = sys.getsizeof(json.dumps(analysis[feature])) * 1e-6
        print(f"-----> Size of {feature}: {round(size, 4)} MB")
    
    total_size = sys.getsizeof(json.dumps(analysis)) * 1e-6
    print(f"-----> Total response size: {round(total_size, 4)}")
