import { addPhoto } from './addPhoto';
const { TestScheduler } = require('jest');


test('return a valid url of Photo' , () => {
    expect(addPhoto('paris')).toBe('https://cdn.pixabay.com/photo/2013/04/11/19/46/louvre-102840_150.jpg')
});