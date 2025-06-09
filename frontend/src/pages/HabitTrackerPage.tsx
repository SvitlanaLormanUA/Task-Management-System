import {Card, CardContent} from "@/components/Card";
import {Button} from "@/components/Button";
import {ChevronLeft, ChevronRight, Check} from "lucide-react";
import { useState } from 'react';
import Header from "@/components/Header.tsx";
import Square from '@/components/Square';
import CreateHabitModal from '@/components/CreateHabitModal';


const HabitTrackerPage = () => {
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const yogaDays = [0, 1, 2, 6]; // Monday, Tuesday, Wednesday, Sunday
    const readingDays = [4, 5]; // Friday, Saturday

    const [isModalOpen, setIsModalOpen] = useState(false);


    return (
        <div className="flex bg-yellow-50 min-h-screen">

            {/* Floating "+" button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#FBD443] text-white text-3xl flex items-center justify-center shadow-lg hover:bg-[#FBD443] transition"
            >
                +
            </button>

            {/* Modal */}
            {isModalOpen && (
                <CreateHabitModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={() => {
                        console.log('New habit:');
                        setIsModalOpen(false);
                    }}
                />
            )}


            <Header className="absolute top-4 left-4 z-10 md:top-6 md:left-6"/>

            {/* Sidebar */}
            <aside className="w-24 bg-yellow-100 flex flex-col justify-center items-center py-4 shadow-md">
                <div className="space-y-4 text-xs text-gray-700">
                    <div className="flex flex-col items-center gap-1">
                        <span className="border rounded px-2 py-1">Completed</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="border rounded px-2 py-1">In progress</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="border rounded px-2 py-1">Planned</span>
                    </div>
                </div>
                <div className="w-36 h-36 rounded-full overflow-hidden mb-4">
                    <img src="./images/bunny.webp" alt="Character" className="w-full h-full object-cover"/>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top menu using Square */}
                <div className="flex justify-center gap-4 mb-4 bg-yellow-100 py-4">
                    {[
                        {title: "calendar", color: "#FAFAF5"},
                        {title: "matrix", color: "#FBD443"},
                        {title: "quick notes", color: "#FEF9F5"},
                        {title: "to-do lists", color: "#FFF7D8"},
                        {title: "goals", color: "#F3D9DA"},
                    ].map((tab) => (
                        <Square
                            key={tab.title}
                            title={tab.title}
                            color={tab.color || "white"}
                            className="w-36 h-24 p-4"
                        />
                    ))}
                </div>

                {/* Date controls */}
                <div className="flex justify-between items-center px-8">
                    <Button variant="ghost"><ChevronLeft/></Button>
                    <h2 className="text-xl font-semibold">6.01 - 12.01</h2>
                    <Button variant="ghost"><ChevronRight/></Button>
                </div>

                {/* Yoga Section */}
                <Card className="bg-blue-100 rounded-3xl mt-4 mb-6 ml-4 mr-4">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">Yoga</h3>
                        <div className="flex gap-2 mb-2">
                            {days.map((day, index) => (
                                <div
                                    key={index}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                        yogaDays.includes(index) ? "bg-blue-600" : "bg-blue-200"
                                    }`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">7 times a week</span>
                            <Check className="text-green-700 w-4 h-4"/>
                        </div>
                    </CardContent>
                </Card>

                {/* Reading Section */}
                <Card className="bg-pink-100 rounded-3xl mt-4 mb-6 ml-4 mr-4">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">Reading</h3>
                        <div className="flex gap-2 mb-2">
                            {days.map((day, index) => (
                                <div
                                    key={index}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                        readingDays.includes(index) ? "bg-pink-600" : "bg-pink-200"
                                    }`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">2 times a week</span>
                            <Check className="text-green-700 w-4 h-4"/>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default HabitTrackerPage;