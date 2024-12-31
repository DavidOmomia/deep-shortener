# Deep Shortener Backend

## Overview

Deep Shortener is a URL shortening service that allows users to create short and unique links for easy sharing and access. This backend service handles URL creation, user authentication, and database management for storing and managing shortened URLs.

## Features

* __User Authentication__: Securely sign up and log in users.
* __User Accounts__: Enables users to view and manage their shortened URLs.
* __Shorten URLs__: Allows users to submit a URL and receive a shortened version.
* __Slug Management__: Ensure uniqueness of slugs and allow users to modify their slugs.
* __Redirection__: Redirect users to the original URL when a shortened URL is accessed.
* __404 Handling__: Display a 404 Not Found page for invalid slugs.
* __Rate Limiting__: Prevent abuse by limiting the number of requests within a specific time frame.
* __API Specification__: Follows a structured API pattern for consistency.
* __Data Seeding__: Includes predefined data for initial setup during containerization.
* __Statistics Tracking__: Tracks visits to each shortened URL.

## Deterministic Slug Generation

### Overview

The slug generation in Deep Shortener uses a __deterministic Linear Congruential Generator (LCG)__ combined with Base62 encoding to produce unique, random-like slugs. This approach ensures a controlled and predictable slug space while avoiding collisions.

### Key Advantages

1. __Predictable Uniqueness__: Deterministic slug generation guarantees unique slugs without relying on external random generators.
2. __Collaboration Safe__: Multiple instances of the service can consistently generate non-overlapping slugs when operating in a transaction-safe environment
3. __Efficiency__: Using an LCG with Base62 encoding is computationally efficient compared to traditional hash-based methods.
4. __Expandable__: Automatically adjusts slug length as the available slug space is exhausted.

### Implementation Details

1. __Linear Congruential Generator (LCG)__: The method uses an LCG with a large prime multiplier (`a = 6364136223846793005n`) and increment (`c = 1n`) to permute sequential indices into random-looking sequences.
2. __Base62 Encoding__: Converts numeric indices into human-friendly strings using a custom character set (`CHARSET`).
3. __Slug Length Adaptation__: Begins with a defined initial slug length and increases dynamically when the total slug space for the current length is exhausted.

### Why Choose Deterministic LCG Over Alternatives?

1. __Better Control Over Slug Space__: Unlike UUIDs or purely random methods, the LCG approach ensures that every index is mapped to a valid slug within a predefined space.
2. __Efficiency in Encoding__: Base62 encoding ensures compact, readable slugs compared to hashed or Base64 slugs.
3. __Reduced Collisions__: Traditional random generation methods may result in collisions that require retries or duplicate checks, which are avoided with deterministic generation.
4. __Scalable__: Automatically adapts slug length to accommodate increased demand without affecting previously generated slugs.

### Example Workflow

1. The system starts with an initial slug length and a sequential index.
2. The index is permuted using the LCG formula:
   
```bash
permutedIndex = (a * index + c) % totalSpace;
```

3. The permuted index is encoded to a Base62 slug.
4. If the current slug space is exhausted, the slug length increases, and the process restarts.

## Technologies Used

* __Node.js__: Backend runtime.
* __Express__: Web framework.
* __Sequelize__: ORM for PostgreSQL.
* __PostgreSQL__: Relational database.
* __TypeScript__: Statically typed JavaScript.
* __Winston__: Logging library.
* __Docker__: Containerization for easy deployment.

## Installation

### Prerequisites

* Docker and Docker Compose

### Steps

1. Clone the repository:

```bash
git https://github.com/DavidOmomia/deep-shortener.git
cd deep-shortener-backend
```

2. Create an `.env` file from the `.env.example`. Your env file should look like this:

```bash
APP_PORT=5050
APP_ENV=development
BASE_URL=http://localhost:5050
APP_FRONTEND_NOT_FOUND_URL=http://localhost:3000/url-not-found

DB_NAME=deep_shortener
DB_USER=deep_origin
DB_PASSWORD=deep_origin_shortener
DB_HOST=db

JWT_SECRET=deep_shortener
RATE_LIMIT_WINDOW_IN_MS=600000
RATE_LIMIT_MAX_REQUESTS=100
```

3. Start the application with Docker:

```bash
npm run docker:start
```

## Usage

### API Endpoints

#### User Routes

* POST `/v1/users/signup`: Sign up a new user.
  
```bash
{
  "email": "user@example.com",
  "password": "P@ssword1"
}
```

* POST `/v1/users/login`: Log in an existing user.
  
```bash
{
  "email": "user@example.com",
  "password": "P@ssword1"
}
```

#### Slug Routes

* GET `/:slug`: Redirect to the original URL or return 404 if the slug is invalid.
* POST `/v1/urls/shorten`: Sign up a new user. `Requires Authentication`
  
```bash
{
  "url": "https://example.com"
}
```

* GET `/v1/urls`: Retrieve all URLs for the authenticated user. `Requires Authentication`
* PUT `/v1/urls/modify`: Modify the slug of an existing URL. `Requires Authentication`

```bash
{
  "slug": "old-slug"
  "newSlug": "new-slug"
}
```

* DELETE `/v1/urls/:slug`: Delete a URL by slug. `Requires Authentication`

## Data Seeding

When the application is started with `npm run docker:start`, predefined data is seeded into the database:
* __User__: 

```bash
email: deep@origin.com 
password: P@ssword1
```

* __URLs__:
  * `https://www.deeporigin.com/`
  * `https://www.youtube.com/watch?v=ahfled5JDDY&ab_channel=DeepOrigin/`
  * `https://www.linkedin.com/company/deep-origin/posts/?feedView=all` __slug__: `deep-linkedin`

## Directory Structure

```bash
.
├── src
│   ├── middleware
│   │   └── middlewareService.ts
│   ├── modules
│   │   ├── users
│   │   │   └── usersController.ts
│   │   └── slugs
│   │       └── slugsController.ts
│   ├── models
│   │   └── index.ts
│   └── routes
│       └── index.ts
├── .env
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Testing

Run unit tests with Jest:

```bash
npm run test:unit
```

## Troubleshooting

1. __Database Connection Errors__:
   * Ensure PostgreSQL is running and the `DB_HOST` in `.env` is correctly set.
2. __Seeding Issues__:
   * Verify the `seed:data` script runs successfully during startup.
3. __Port Conflicts__:
   * Make sure the `5050` and `5432` ports are not in use by other applications.

## Future Enhancements

* Enhanced analytics for tracking URL visits.
* Integration with external URL validation services.
* Improved scalability with distributed slug generation.

# Thank you Deep Origin team for the task