import requests
from django.conf import settings

TMDB_API_KEY = settings.TMDB_API_KEY
BASE_URL = "https://api.themoviedb.org/3/discover/tv"

def get_kdramas(page=1, min_score=None, max_score=None, score=None):
    # Construct the URL with query parameters
    url = f"{BASE_URL}?api_key={TMDB_API_KEY}&with_genres=10764&with_original_language=ko&page={page}"

    if score:
        url+=f"&vote_average={score}"
    else:
        if min_score:
            url += f"&vote_average.gte={min_score}"
        if max_score:
            url += f"&vote_average.lte={max_score}"

    # Send the request
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Unable to fetch data"}
