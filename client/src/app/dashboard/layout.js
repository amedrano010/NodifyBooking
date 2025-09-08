import Shell from "./components/layout/Shell";
import Providers from "./context/Providers";

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <Shell>
                        {children}
                        <Toaster
                            position="bottom-center"
                            reverseOrder={false}
                        />
                    </Shell>
                </Providers>
            </body>
        </html>
    );
}
