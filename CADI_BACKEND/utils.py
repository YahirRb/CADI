import environ
from supabase import create_client
env = environ.Env()
 
environ.Env.read_env()
url = env('SUPABASE_URL')
key = env('SUPABASE_KEY')
supabase= create_client(url, key)