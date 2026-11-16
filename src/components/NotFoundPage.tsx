import StatePanel from "./StatePanel";

function NotFoundPage() {
    return (
        <StatePanel
            variant="notFound"
            title="페이지를 찾을 수 없어요"
            description="주소를 확인하거나 도감으로 돌아가세요."
            links={[
                { label: "도감으로", to: "/pokemon", variant: "primary" },
                { label: "홈으로", to: "/", variant: "secondary" },
            ]}
        />
    );
}

export default NotFoundPage;
