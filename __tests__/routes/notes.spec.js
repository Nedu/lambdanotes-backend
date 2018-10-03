const mongoose = require('mongoose');
const request = require('supertest');
const faker = require('faker');
const path = require('path');

const notes = require('../../api/controllers/notes');
const Note = require('../../api/models/Note');
const User = require('../../api/models/User');
const server = require('../../server');
const { makeToken } = require('../../api/config/auth');

const { userName, password } = faker.internet;
const { words, sentences, word } = faker.lorem;
const testId = require('mongoose').Types.ObjectId();
let testToken;
const env = require(path.join(__dirname, '../../env')) || process.env;

// if (process.env.NODE_ENV !== 'production') {
//     env = require(path.join(__dirname, '../../env'));
// } else {
//     env = process.env;
// }

describe('Notes API', () => {
    beforeAll(() => {
        const notesData = [];
        for (let i = 0; i < 5; i++) {
            notesData.push({ author: testId.toJSON(), title: words(), content: sentences(), tags: [word()] })
        }
        return mongoose.connect(env.DATABASE_URL)
        .then(() => User.create({ username: userName(), password: password() })
        .then(user => testToken = makeToken(user)))
        .then(() => Note.insertMany(notesData))
    });


    afterAll(() => {
        return Note.remove()
        .then(() => mongoose.disconnect())
    });

    it('should fail when env is not testing', () => {
      expect(process.env.NODE_ENV).toEqual('testing');
    });

    describe('[GET] /api/v1/notes', () => {
        it('should deny access to requests with a missing or invalid token', async () => {
            const missingResponse = await request(server).get(`/api/v1/notes`);
            const invalidResponse = await request(server).get(`/api/v1/notes`).set('Authorization', 'token');

            expect(missingResponse.status).toBe(400);
            expect(invalidResponse.type).toBe(404);
        });
    })

    describe('[GET] /api/v1/notes', () => {
        it('should retrieve all notes with a valid token', async () => {
            const response = await request(server).get(`/api/v1/notes`).set('Authorization', 'Bearer ' + testToken);

            expect(response.status).toEqual(200);
            expect(response.type).toEqual('application/json');
            expect(response.body.notes).toHaveLength(5); 
        });
    })

    describe('[GET] /api/v1/notes/:id', () => {
        it('should retrieve a single note with a valid id and token', async () => {
            const note =  { author: testId.toJSON(), title: words(), content: sentences(), tags: [word()] };
            const newNote = await Note.create(note);
            const response = await request(server).get(`/api/v1/notes/${newNote._id}`).set('Authorization', 'Bearer ' + testToken);

            expect(response.status).toEqual(200);
            expect(response.type).toEqual('application/json');
            expect(response.body).not.toBeUndefined();
            expect(response.body).toMatchObject({
              author: note.author,
              content: note.content,
              tags: note.tags,
              title: note.title
            });
        });
    })

    describe('[POST] /api/v1/notes', () => {
        it('should create a new note with a valid token', async () => {
            const note = { author: testId.toJSON(), title: words(), content: sentences(), tags: [word()] };
            const response = await request(server)
            .post(`/api/v1/notes`)
            .send(note)
            .set('Authorization', 'Bearer ' + testToken);
            
            expect(response.status).toEqual(201);
            expect(response.type).toEqual('application/json');
            expect(response.body).toMatchObject({
                author: note.author,
                content: note.content,
                tags: note.tags,
                title: note.title, });
            expect(response.body).toHaveProperty('_id');
        });
    });

    describe('[PUT] /api/v1/notes/:id', () => {
        it('should update an existing note with a valid id and token', async () => {
            const note = { author: testId.toJSON(), title: words(), content: sentences(), tags: [word()] };
            const newNote = await Note.create(note);
            const updatedNote = { title: words(), content: sentences() };
            const response = await request(server)
                .put(`/api/v1/notes/${newNote._id}`)
                .send(updatedNote)
                .set('Authorization', 'Bearer ' + testToken);

            expect(response.status).toEqual(200);
            expect(response.type).toEqual('application/json');
            expect(response.body).toMatchObject(updatedNote);
            expect(response.body).toHaveProperty('_id');
        });
    });


    describe('[DELETE] /api/v1/notes/:id', () => {
        it('should delete an existing note with a valid id and token', async () => {
            const note = { author: testId.toJSON(), title: words(), content: sentences(), tags: [word()] };
            const newNote = await Note.create(note);
            const response = await request(server).delete(`/api/v1/notes/${newNote._id}`).set('Authorization', 'Bearer ' + testToken);;
            
            expect(response.status).toEqual(200);
        })
    })
})