import { TrafficChart } from '../../shared/components/traffic';
import { Footer } from '../../shared/components/footer';
import { ChatBox } from '../../shared/components/chatbox';

export const AppBottom = ({chatMessages}) => {
    return(
        <div>
            <div class="row">
                <ChatBox messages={chatMessages} />
                <TrafficChart />
            </div>
            <Footer />
        </div>
    )
}