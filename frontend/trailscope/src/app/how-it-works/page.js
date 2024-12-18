import React from 'react';

const HowItWorks = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white text-black">
      <h1 className="text-3xl font-semibold text-center mb-6">How TrailScope Works</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">1. Creating a Trail</h2>
        <p>
          When you visit TrailScope, you can start by creating your own trail by interacting with an interactive map.
          Simply click on the map to place waypoints (coordinates), and these will form the path of your trail.
          You’ll also be able to add important details like the trail’s name, description, and difficulty rating (on a scale of 1 to 5).
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">2. Trail Metrics</h2>
        <p>
          As you define your trail, we automatically calculate important metrics, including the <strong>trail length</strong> and an <strong>elevation profile</strong>.
          The trail length is calculated by measuring the distance between each consecutive waypoint.
          Additionally, we fetch elevation data from an external service to generate an elevation profile, showing how the terrain changes along the trail.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">3. Submitting Your Trail</h2>
        <p>
          Once you’ve completed your trail and reviewed the metrics, you can submit it to be securely stored in our system.
          Your trail data, including coordinates, elevation profile, and length, will be saved and accessible for future use or sharing.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">4. Map Interaction</h2>
        <p>
          The map is fully interactive, allowing you to zoom in and out, move around, and click to place waypoints.
          As you click, a line is drawn on the map to visualize your trail in real-time, helping you track your progress and plan the best route.
        </p>
      </section>
    
      
      <section>
        <h2 className="text-2xl font-semibold">Explore and Create Your Own Trail!</h2>
        <p>
          With TrailScope, planning, creating, and analyzing trails is simple and efficient. Whether you’re creating a new hiking path or exploring existing trails, our platform provides all the tools you need to enhance your outdoor adventures.
        </p>
      </section>
    </div>
  );
};

export default HowItWorks;
