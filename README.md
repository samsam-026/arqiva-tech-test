# Setup

## Backend

The backend did not install and serve as expected, so I had created a new FastAPI project and replaced the data and API file

```bash
cd server
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
fastapi dev main.py
```

## Frontend

This was done using Node version 20 with NVM

```bash
nvm install 20
nvm use 20
npm i
npm run dev
```

# Functionality included

- Build home page to show list of contributions
- Allow filtering by title, owner or description
- Allow ordering by id, title, owner, description, start and end time
- Load contributions from URL parameters

## Example URLs

Following are some URLs that can be used to load the contributions page directly

- [/?page=2](http://localhost:3000/?page=2)
- [/?page=2&order_by=title](http://localhost:3000/?page=2&order_by=title)
- [/?order_by=description&owner=gl](http://localhost:3000/?order_by=description&owner=gl)