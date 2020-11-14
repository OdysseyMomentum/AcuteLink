export const Card = ({header, title, text, hightlight}) => {
    return(
        <div class="col-12 col-md-6 col-lg-3 mb-4 mb-lg-0">
            <div class="card">
                <h5 class="card-header">{header}</h5>
                <div class="card-body">
                    <h5 class="card-title">{title}</h5>
                    <p class="card-text">{text}</p>
                    <p class="card-text text-success">{hightlight}</p>
                </div>
            </div>
        </div>
    )
}