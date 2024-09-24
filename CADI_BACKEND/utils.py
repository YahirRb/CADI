import environ
from supabase import create_client, Client
env = environ.Env()
 
environ.Env.read_env()
url = env('SUPABASE_URL')
key = env('SUPABASE_KEY')
supabase: Client = create_client(url, key)