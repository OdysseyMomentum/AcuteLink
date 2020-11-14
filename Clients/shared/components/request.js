export const requestList = () => {
    return(
        <ul class="nav flex-column">					                                       
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                    width="24" height="24" viewBox="0 0 24 24" 
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                    stroke-linejoin="round" class="feather feather-bar-chart-2">
                    <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4">
                    </line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    <span class="ml-2">REQUEST AZC</span> 
                </a> Received: 4h ago
            </li>
        </ul>
    )
}