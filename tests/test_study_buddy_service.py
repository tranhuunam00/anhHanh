"""Unit tests for Study Buddy & Location Services."""
import pytest
import math
from app.application.study_buddy_service import (
    calculate_haversine_distance_km,
    format_distance_display,
)


class TestStudyBuddyDistanceCalculations:
    """Tests for Haversine distance and formatting utility functions."""

    def test_haversine_distance_same_location(self):
        """Distance between identical coordinates must be 0.0."""
        dist = calculate_haversine_distance_km(21.0285, 105.8542, 21.0285, 105.8542)
        assert dist == 0.0

    def test_haversine_distance_hanoi_to_hochiminh(self):
        """Distance between Hanoi and Ho Chi Minh City is ~1130-1160 km."""
        hanoi_lat, hanoi_lon = 21.0285, 105.8542
        hcm_lat, hcm_lon = 10.8231, 106.6297
        dist = calculate_haversine_distance_km(hanoi_lat, hanoi_lon, hcm_lat, hcm_lon)
        assert 1100.0 <= dist <= 1200.0

    def test_haversine_distance_nearby_points(self):
        """Distance for ~1km separation within a city."""
        # Approx 0.01 deg lat is ~1.11 km
        dist = calculate_haversine_distance_km(21.0285, 105.8542, 21.0385, 105.8542)
        assert 1.0 <= dist <= 1.2

    def test_haversine_distance_invalid_coordinates(self):
        """Out of bounds coordinates return fallback large distance."""
        dist = calculate_haversine_distance_km(95.0, 105.0, 21.0, 105.0)
        assert dist >= 99999.0

        dist2 = calculate_haversine_distance_km(21.0, 190.0, 21.0, 105.0)
        assert dist2 >= 99999.0

    def test_format_distance_display_meters(self):
        """Distances under 1km format as meters."""
        assert format_distance_display(0.85) == "Cách 850 m"
        assert format_distance_display(0.05) == "Cách 50 m"
        assert format_distance_display(0.005) == "Cách 10 m"

    def test_format_distance_display_kilometers(self):
        """Distances >= 1km format as kilometers."""
        assert format_distance_display(1.23) == "Cách 1.2 km"
        assert format_distance_display(15.0) == "Cách 15.0 km"
        assert format_distance_display(120.456) == "Cách 120.5 km"

    def test_format_distance_display_invalid_or_negative(self):
        """None or negative distances return fallback message."""
        assert format_distance_display(None) == "Không xác định"
        assert format_distance_display(-5.0) == "Không xác định"

