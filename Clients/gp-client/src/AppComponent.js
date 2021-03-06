import { Navbar } from '../../shared/components/navbar';
import { Sidebar } from '../../shared/components/sidebar';
import { Card } from '../../shared/components/card';
import { Dependencies } from '../../shared/dependencies';
import { AppBottom } from '../../shared/components/appBottom';
import { BreadcrumbNavigation } from '../../shared/components/breadcrumb';


export const AppComponent = ({messages}) => {
    return (
        <div className="App">
        <Dependencies />
        <Navbar clientName="General Practioner Dashboard" userName="Hello, Dr. Mary Jane" />
        <div class="container-fluid">
            <div class="row">
                <Sidebar />
                <main class="col-md-9 ml-sm-auto col-lg-10 px-md-4 py-4">
                    <BreadcrumbNavigation/>
                    <h1 class="h2">GP Dashboard</h1>
                    <p>This is the homepage of a simple general practioner interface...</p>
                    <div class="row my-4">
                        <Card header="Patients" title="345" text="..." hightlight="18.2% increase since last month" />
                        <Card header="Column B" title="..." text="..." hightlight="..." />
                        <Card header="Column C" title="..." text="..." hightlight="..." />
                        <Card header="Column D" title="..." text="..." hightlight=".." />
                    </div>
                    <AppBottom chatMessages={messages} />
                </main>
            </div>
        </div>
    </div>
    )
}