import { Navbar } from '../../shared/components/navbar';
import { Sidebar } from '../../shared/components/sidebar';
import { Card } from '../../shared/components/card';
import { TrafficChart } from '../../shared/components/traffic';
import { Dependencies } from '../../shared/dependencies';
import { formatDate } from '../../shared/utils/utils';
import { ChatBox } from '../../shared/components/chatbox';

export const AppComponent = ({chatMessages}) => {
    return (
        <div className="App">
        <Navbar clientName="General Practioner Dashboard" userName="Hello, Dr. Mary Jane" />
        <div class="container-fluid">
            <div class="row">
                <Sidebar />
                <main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#">Home</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Overview</li>
                        </ol>
                    </nav>
                    <h1 class="h2">Dashboard</h1>
                    <p>This is the homepage of a simple general practioner interface...</p>
                    <div class="row my-4">
                        <Card header="Patients" title="345" text="..." hightlight="18.2% increase since last month" />
                        <Card header="Column B" title="..." text="..." hightlight="..." />
                        <Card header="Column C" title="..." text="..." hightlight="..." />
                        <Card header="Column D" title="..." text="..." hightlight=".." />
                    </div>
                    <div class="row">
                        <ChatBox messages={chatMessages} />
                        <TrafficChart />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
        <Dependencies />
    </div>
    )
}