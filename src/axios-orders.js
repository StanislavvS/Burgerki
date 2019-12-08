import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://react-my-burger-338ef.firebaseio.com/'
})

export default instance;