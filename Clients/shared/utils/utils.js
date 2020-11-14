export const formatDate = (string) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    return new Date(string).toLocaleDateString([],options);
}

export const setupApp = () => {
    if (localStorage.getItem('clientId') == null) {
        register(this.entity_id); 
    }

    this.timer_alive = setInterval(()=> send_alive(), ALIVE_INTERVAL);
    this.timer_message = setInterval(()=> get_messages(), MESSAGE_INTERVAL);
}