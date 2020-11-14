import { formatDate } from "../utils/utils"

export const ChatBox = ({messages}) => {
    return (
        <div class="col-12 col-xl-8 mb-4 mb-lg-0">
            <div class="card">
                <h5 class="card-header">Latest messages</h5>
                <center>
                    <table style={{"width": "500px"}}>
                            {messages ? messages.map((k) => <tr><td>{formatDate(k['timestamp'])}</td> <td>{k['message']}</td></tr>): 'No messages yet' }          
                    </table> 
                    </center>                                
            </div>
        </div>
    )
}