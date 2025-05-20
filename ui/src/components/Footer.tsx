import React from "react"

class Footer extends React.Component {
    render() {
        return (
            <div className="footer py-5">
                <p className="text-center copyright">
                    © Copyright {new Date().getFullYear()} Sameeha Rahman
                </p>
            </div>
        )
    }
}

export default Footer
