import random
import json

# Sample countries to pick from (some foreign, some local)
countries = ["India", "Australia", "England", "South Africa", "Sri Lanka", "New Zealand", "Pakistan", "West Indies"]
indian_names = ["Rohit Sharma", "Virat Kohli", "Jasprit Bumrah", "Ravindra Jadeja", "KL Rahul", "Shubman Gill", "Rishabh Pant", "Hardik Pandya"]
foreign_names = ["Steve Smith", "Joe Root", "Kane Williamson", "David Warner", "Ben Stokes", "Mitchell Starc", "Quinton de Kock", "Babar Azam", "Andre Russell", "Trent Boult"]

# 4 buyers
buyers = [
    {
        "firstName": "Rahul",
        "lastName": "Verma",
        "password": "pass123",
    },
    {
        "firstName": "Sneha",
        "lastName": "Kumar",
        "password": "pass123",
    },
    {
        "firstName": "Amit",
        "lastName": "Patel",
        "password": "pass123",
    },
    {
        "firstName": "Pooja",
        "lastName": "Reddy",
        "password": "pass123",
    }
]

# Generate 20 players
players = []
for i in range(20):
    is_foreigner = i >= 10  # First 10 Indian, rest foreigners
    name = random.choice(foreign_names if is_foreigner else indian_names)
    country = random.choice([c for c in countries if c != "India"]) if is_foreigner else "India"
    role = random.choice(["batsman", "bowler", "all-rounder"])
    economyOrAverage = round(random.uniform(20.0, 60.0), 2)
    matchesPlayed = random.randint(10, 100)
    bestScore = f"{random.randint(50, 150)}*"
    basePrice = random.choice([2, 5, 8])
    image = f"https://example.com/player{i+1}.jpg"

    players.append({
        "name": name,
        "age": random.randint(20, 35),
        "country": country,
        "role": role,
        "economyOrAverage": economyOrAverage,
        "matchesPlayed": matchesPlayed,
        "bestScore": bestScore,
        "basePrice": basePrice,
        "image": image,
        "password": "playerpass",
        "isPurchased": False,
        "team": "",
        "soldPrice": 0,
        "isForeigner": is_foreigner
    })

buyers, players[:20]  # Return only 20 players
