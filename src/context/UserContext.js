import React from 'react';

const userContext = React.createContext();

function grabUserFromLocalStorage() {
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
}

function UserContext(props) {
    const [user, setUser] = React.useState(grabUserFromLocalStorage());
    React.useEffect(() => {

        localStorage.setItem('user', JSON.stringify(user))

    }, [user])
    return (
        <userContext.Provider value={{ user, setUser }}>
            {props.children}
        </userContext.Provider>
    )
}

export { UserContext, userContext }
