import { useEffect } from "react";
import confetti from "canvas-confetti";

const Confetti: React.FC = () => {
    useEffect(() => {
        confetti({
            particleCount: 600,
            spread: 200,
            origin: { y: 0.6 },
            colors: ['#ff6262', '#98ff98', '#4848ff'],
        });
    }, []);

    return null; // Komponent nie renderuje nic na stronie
};

export default Confetti;
