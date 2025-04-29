import React, { useState, useEffect } from 'react';
import homeData from './data/HomePage.json';
import './css/HomePage.css';

export default function BrochureHomePage() {
    // pull in all the editable content from JSON
    const { contactInfo, infoSections, productCards } = homeData;

    // state to hold geocoded coords
    const [coords, setCoords] = useState({ lat: null, lon: null });

    // geocode whenever the address changes
    useEffect(() => {
        const address = encodeURIComponent(
            `${contactInfo.addressLine1}, ${contactInfo.cityStateZip}`
        );
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    setCoords({
                        lat: parseFloat(data[0].lat),
                        lon: parseFloat(data[0].lon),
                    });
                }
            })
            .catch(err => console.error('Geocoding failed:', err));
    }, [contactInfo.addressLine1, contactInfo.cityStateZip]);

    // build "open in maps" URL
    const getMapURL = () => {
        const address = encodeURIComponent(
            `${contactInfo.addressLine1}, ${contactInfo.cityStateZip}`
        );
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const googleMaps = `https://www.google.com/maps/search/?api=1&query=${address}`;
        const appleMaps = `http://maps.apple.com/?q=${address}`;
        return /iPad|iPhone|iPod/.test(ua) && !window.MSStream
            ? appleMaps
            : googleMaps;
    };

    // small bounding box around point (~500m)
    const delta = 0.005;
    const bbox =
        coords.lat && coords.lon
            ? `${coords.lon - delta},${coords.lat - delta},${coords.lon + delta},${coords.lat + delta}`
            : null;

    return (
        <div className="brochure-container">
            {/* Hero Section */}
            <section className="hero-section">
                <img
                    src="https://placehold.co/800x400"
                    alt="Monuvita Granite Memorials"
                />
                <h1>Memorials That Stand the Test of Time</h1>
                <p>
                    Monuvita Granite brings over 40 years of craftsmanship to families
                    across Conroe and the surrounding areas, creating custom granite
                    headstones, grave markers, urns, and memorial benches built to honor
                    and endure.
                </p>
            </section>

            {/* Contact Card */}
            <section className="contact-card">
                <div className="contact-inner">
                    <h2>Contact {contactInfo.businessName}</h2>
                    <p>
                        Call {contactInfo.contactPerson} at {contactInfo.businessName} to
                        find out more about the funeral memorials, urns, and headstones you
                        can get to help remember your loved one for years to come.{' '}
                        {contactInfo.tagline}
                    </p>
                    <div className="contact-details">
                        <div className="address">
                            <p>{contactInfo.businessName}</p>
                            <p>{contactInfo.addressLine1}</p>
                            <p>{contactInfo.cityStateZip}</p>
                            <p>
                                <a href={`mailto:${contactInfo.email}`}>
                                    {contactInfo.email}
                                </a>
                            </p>
                        </div>
                        <div className="phones">
                            <p>
                                <strong>Phone:</strong> {contactInfo.phone}
                            </p>
                            <p>
                                <strong>Alternate Phone:</strong> {contactInfo.altPhone}
                            </p>
                            <p>
                                <strong>Fax:</strong> {contactInfo.fax}
                            </p>
                        </div>
                        <div className="hours">
                            <h3>Business Hours</h3>
                            <p>
                                <strong>Mon - Fri:</strong>{' '}
                                {contactInfo.businessHours.MondayFriday}
                            </p>
                            <p>
                                <strong>Saturday:</strong>{' '}
                                {contactInfo.businessHours.Saturday}
                            </p>
                            <p>
                                <strong>Sunday:</strong> {contactInfo.businessHours.Sunday}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Sections */}
            {infoSections.map((section, idx) => (
                <div
                    key={idx}
                    className={`info-section ${
                        idx % 2 === 0 ? 'normal-layout' : 'reverse-layout'
                    }`}
                >
                    <div className="info-bg" />
                    <div className="info-content">
                        <img src={section.img} alt={section.alt} />
                        <div className="text">
                            <h2>{section.title}</h2>
                            <p>{section.content}</p>
                        </div>
                    </div>
                </div>
            ))}

            {/* Products & Services */}
            <section className="products-section">
                <h2 className="products-heading">Products &amp; Services</h2>
                <div className="product-grid">
                    {productCards.map((product, idx) => (
                        <div className="product-card" key={idx}>
                            <div className="product-bg" />
                            <img src={product.img} alt={product.alt} />
                            <h3>{product.title}</h3>
                            <p>{product.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Map Section */}
            <section className="map-section">
                <h2>Visit {contactInfo.businessName}</h2>
                {coords.lat && coords.lon ? (
                    <div className="map-container">
                        <iframe
                            title="Monuvita Granite Location"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat},${coords.lon}`}
                            width="100%"
                            height="300"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight="0"
                            marginWidth="0"
                        />
                    </div>
                ) : (
                    <p>Loading map…</p>
                )}
                <p>
                    <a href={getMapURL()} target="_blank" rel="noopener noreferrer">
                        Open in Maps
                    </a>
                </p>
            </section>
        </div>
    );
}
