from libsql_client import create_client_sync
client = create_client_sync("libsql://calendar-svitlanalormanua.aws-eu-west-1.turso.io", auth_token="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDg3MTY5MTcsImlkIjoiOWQzODMzNjMtMWUxNi00MDgxLTgyYzQtYTczMjQyNGYyOTgxIiwicmlkIjoiOWRmOTYxMGMtZWQ2MC00MDFmLTgyNTMtMjE5MTc5OGVjOWNiIn0.iqMZJgjh14ZeV0h-bEgHVh-tAK4USuWZrHPW76zcHFxEqRO39Xi0PsVIwLowv9lLNnNkL4KTjcnBJ8GoxwJhCQ")
try:
    result = client.execute("SELECT 1")
    print("Connection successful:", result)
except Exception as e:
    print("Connection error:", e)