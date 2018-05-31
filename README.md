# Backend for lambda notes

# API Documentation
Here's the description of the lambda notes API.

## Port - Location of all endpoints to interface with our API is at `http://localhost:5000`

## [POST] `/api/notes`
| Endpoints         | Type          | Data  |
| -------------     |:-------------:| -----:|
| /api/v1/notes     | POST          | json  |

### Example:
```
{
    title: 'Red',
    content: 'Jason',
    tags: ['tag1', 'tag1']
}
```

## [GET] `/api/notes`