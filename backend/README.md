# API Endpoint Summary for Writer/Editor Dashboard

### Authentication

| Route           | HTTP Method | Access | Description                                                            |
|-----------------|-------------|--------|------------------------------------------------------------------------|
| `/auth/login`   | POST        | Public | Authenticate user and return a JWT token                               |

### User Management (Editor Only)

| Route           | HTTP Method | Access | Description                                                            |
|-----------------|-------------|--------|------------------------------------------------------------------------|
| `/users/`       | GET         | Editor | Fetch all users                                                        |
| `/users/`       | POST        | Editor | Create a new user with hashed password                                 |
| `/users/:id`    | PUT         | Editor | Update an existing user (password, role, and status)                   |

### Company Management (Editor Only)

| Route             | HTTP Method | Access | Description                                                            |
|-------------------|-------------|--------|------------------------------------------------------------------------|
| `/companies/`     | GET         | Editor | Fetch all companies                                                    |
| `/companies/`     | POST        | Editor | Create a new company                                                   |
| `/companies/:id`  | PUT         | Editor | Update an existing company                                             |

### Article Management

| Route                 | HTTP Method | Access       | Description                                                                                   |
|-----------------------|-------------|--------------|-----------------------------------------------------------------------------------------------|
| `/articles/`          | POST        | Writer       | Create a new article; status set to "For Edit" and assigns current writer as author           |
| `/articles/:id`       | PUT         | Writer       | Update an existing article (only if the status is "For Edit")                                 |
| `/articles/:id/publish` | PUT      | Editor       | Publish an article by setting status to "Published" and assigning the current editor          |
| `/articles/`          | GET         | Writer, Editor | Fetch all articles, showing different lists for writers and editors based on status          |
