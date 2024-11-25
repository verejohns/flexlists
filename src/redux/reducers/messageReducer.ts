// Define the initial state
const initialState = {
    messages: [
        {
          id: 1,
          content: 'Lorem ipsum dolor sit amet consectetur. Tempus aliquam tortor ullamcorper vestibulum sit. Ac velit lectus quis non tortor scelerisque in velit.',
          user: 'Nina Doe',
          avatar: '/assets/images/avatars/avatar_1.jpg',
          time: '03/27/2023 08:00:00',
          over: false
        },
        {
          id: 2,
          content: 'Lorem ipsum dolor sit amet consectetur. Tempus aliquam tortor ullamcorper vestibulum sit. Ac velit lectus quis non tortor scelerisque in velit.',
          user: 'Nina Doe',
          avatar: '/assets/images/avatars/avatar_1.jpg',
          time: '03/27/2023 08:00:00',
          over: false
        },
        {
          id: 3,
          content: 'Lorem ipsum dolor sit amet consectetur. Tempus aliquam tortor ullamcorper vestibulum sit. Ac velit lectus quis non tortor scelerisque in velit.',
          user: 'me',
          avatar: '/assets/images/avatars/avatar_1.jpg',
          time: '03/27/2023 08:00:00',
          over: false
        }
      ]
}
// Define the reducer
const messageReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case 'SET_MESSAGES':
        return { ...state, messages: action.payload };
      
      default:
        return state;
    }
  };
export default messageReducer;