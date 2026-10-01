import "./Notice.css";

type NoticeProps = {
    title: string;
    description: string;
};

function Notice({ title, description }: NoticeProps) {
    return (
        <div className="notice" role="status">
            <span className="notice__badge" aria-hidden="true">
                !
            </span>
            <div className="notice__text">
                <p className="notice__title">{title}</p>
                <p className="notice__description">{description}</p>
            </div>
        </div>
    );
}

export default Notice;
