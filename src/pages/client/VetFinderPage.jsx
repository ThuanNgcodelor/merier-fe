import React from "react";
import VetFinder from "../../components/client/VetFinder.jsx";
import Header from "../../components/client/Header.jsx";

export default function VetFinderPage() {
  return (
        <div className="wrapper">
            <Header/>
            <main className="main-content">
                <VetFinder />;
            </main>
        </div>
    );
}