import { Navbar } from '../../shared/components/navbar';
import { TrafficChart } from '../../shared/components/traffic';
import { Card } from '../../shared/components/card';
import { Dependencies } from '../../shared/dependencies';

export const AppComponent = () => {
    return (
        <div className="App">
            <Navbar clientName="Centralist Dashboard" userName="Hello, Dr. Hulsberg" />
            <div class="container-fluid">
                <div class="row">
                    <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                        <div class="position-sticky">
                                <input type="text" placeholder="Search.." name="search"></input>  <br></br>
                                <br></br>
                            <RequestList />
                        </div>
                    </nav>
                    <main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Overview</li>
                            </ol>
                        </nav>
                        <h1 class="h2">Dashboard</h1>
                        <p>This is the homepage of a simple general practioner interface...</p>
                        <div class="row">
                        <Card header="Patient information" title="345" text="..." hightlight="18.2% increase since last month" />
                        <Card header="Capacity information" title="..." text="..." hightlight="18.2% increase since last month" />
                        </div>
                        <div class="row">
                            <div class="col-12 col-xl-8 mb-4 mb-lg-0">
                                <div class="card">
                                    <h5 class="card-header">Chatbox</h5>
                                    <center><table style={{"width": "500px"}}>
                                                {this.state.messages ? this.state.messages.map((k) => <tr><td>{this.formatDate(k['timestamp'])}</td> <td>{k['message']}</td></tr>): 'No messages yet' }     
                                                </table> </center>                                
                                </div>
                            </div>
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