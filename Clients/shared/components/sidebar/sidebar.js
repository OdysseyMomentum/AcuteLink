export const Sidebar = () => {
    return(
        <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div class="position-sticky">
                <ul class="nav flex-column">
                    <SidebarItem itemName="Dashboard" />
                    <SidebarItem itemName="Book an ER spot" />
                    <SidebarItem itemName="Patients" />
                    <SidebarItem itemName="Reports" />
                </ul>
            </div>
        </nav>
    )
}

const SidebarItem = ({itemName}) => {
    return (
        <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <span class="ml-2">{itemName}</span>
            </a>
        </li>
    )
}