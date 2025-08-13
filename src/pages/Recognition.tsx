import { Outlet } from "react-router-dom";

export default function Recognition() {
    return (
        <div>Recognition

            <div className="pt-24">
                <Outlet></Outlet>
            </div>

        </div>

    )
}
