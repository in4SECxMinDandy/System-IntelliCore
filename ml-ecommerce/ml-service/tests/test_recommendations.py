"""
ML Service Tests (Phase 4.1)
Compatible with pytest-asyncio 0.23.x in strict mode.
Uses pytest_asyncio.fixture for async fixtures.
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock

# ==========================================
# Marks for async mode
# ==========================================
pytestmark = pytest.mark.asyncio


# ==========================================
# Mock ModelManager
# ==========================================

@pytest.fixture
def mock_model_manager():
    """Mock ModelManager with pre-trained recommender."""
    mm = MagicMock()
    mock_recommender = MagicMock()
    mock_recommender.for_user = AsyncMock(return_value=["prod-1", "prod-2", "prod-3"])
    mock_recommender.similar_to = AsyncMock(return_value=["prod-a", "prod-b"])
    mock_recommender.popular = AsyncMock(return_value=["trend-1", "trend-2"])
    mock_recommender.frequently_bought_with = AsyncMock(return_value=["fbt-1", "fbt-2"])
    mm.recommender = mock_recommender
    return mm


@pytest_asyncio.fixture
async def test_client(mock_model_manager):
    """Create async test client with mocked dependencies."""
    from main import app
    app.state.model_manager = mock_model_manager
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client


# ==========================================
# Recommendation Tests
# ==========================================

class TestRecommendations:

    async def test_user_recommendations_valid_uuid(self, test_client):
        """Should return recommendations for valid user UUID."""
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        response = await test_client.get(
            f"/recommendations/user?user_id={user_id}&limit=5"
        )
        assert response.status_code == 200
        data = response.json()
        assert "product_ids" in data

    async def test_user_recommendations_invalid_uuid(self, test_client):
        """Should return 422 for invalid UUID format."""
        response = await test_client.get(
            "/recommendations/user?user_id=not-a-uuid"
        )
        assert response.status_code == 422

    async def test_similar_products_valid_uuid(self, test_client):
        """Should return similar products for valid product UUID."""
        product_id = "550e8400-e29b-41d4-a716-446655440001"
        response = await test_client.get(
            f"/recommendations/similar?product_id={product_id}&limit=4"
        )
        assert response.status_code == 200
        data = response.json()
        assert "product_ids" in data

    async def test_similar_products_invalid_uuid(self, test_client):
        """Should return 422 for invalid product UUID format."""
        response = await test_client.get(
            "/recommendations/similar?product_id=12345"
        )
        assert response.status_code == 422

    async def test_trending_products(self, test_client):
        """Should return popular products without authentication."""
        response = await test_client.get("/recommendations/popular?limit=6")
        assert response.status_code == 200
        data = response.json()
        assert "product_ids" in data

    async def test_frequently_bought_valid(self, test_client):
        """Should return frequently bought with for valid UUID."""
        product_id = "550e8400-e29b-41d4-a716-446655440002"
        response = await test_client.get(
            f"/recommendations/frequently-bought?product_id={product_id}&limit=4"
        )
        assert response.status_code == 200
        assert "product_ids" in response.json()

    async def test_limit_validation(self, test_client):
        """Should enforce limit bounds (max 50)."""
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        # Limit too high — expect 422
        response = await test_client.get(
            f"/recommendations/user?user_id={user_id}&limit=999"
        )
        assert response.status_code == 422

        # Limit zero — expect 422
        response = await test_client.get(
            f"/recommendations/user?user_id={user_id}&limit=0"
        )
        assert response.status_code == 422


# ==========================================
# Health Endpoint Tests
# ==========================================

class TestHealth:

    async def test_health_check(self, test_client):
        """Health endpoint should return 200 with status."""
        response = await test_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") in ("ok", "healthy", "degraded")

    async def test_detailed_health(self, test_client):
        """Health endpoint should include model status info."""
        response = await test_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        # Should include models_loaded key
        assert "models_loaded" in data


# ==========================================
# Event Tracking Tests
# ==========================================

class TestEventTracking:

    async def test_track_product_view(self, test_client):
        """Should accept product_view event."""
        payload = {
            "event_type": "product_view",
            "user_id": "550e8400-e29b-41d4-a716-446655440000",
            "product_id": "550e8400-e29b-41d4-a716-446655440001",
        }
        response = await test_client.post("/events/track", json=payload)
        assert response.status_code == 202
        data = response.json()
        assert data["accepted"] is True
        assert data["event_type"] == "product_view"

    async def test_track_invalid_event_type(self, test_client):
        """Should reject unknown event types."""
        payload = {"event_type": "invalid_event_type"}
        response = await test_client.post("/events/track", json=payload)
        assert response.status_code == 422

    async def test_track_batch_events(self, test_client):
        """Should accept batch of up to 100 events."""
        events = [
            {
                "event_type": "product_view",
                "product_id": f"550e8400-e29b-41d4-a716-44665544{i:04d}",
            }
            for i in range(5)
        ]
        response = await test_client.post(
            "/events/track/batch", json={"events": events}
        )
        assert response.status_code == 202
        assert response.json()["count"] == 5

    async def test_track_invalid_uuid_field(self, test_client):
        """Should reject invalid UUID for user_id."""
        payload = {
            "event_type": "product_view",
            "user_id": "not-a-uuid",
        }
        response = await test_client.post("/events/track", json=payload)
        assert response.status_code == 422


# ==========================================
# Model Manager Tests (sync — no fixture needed)
# ==========================================

class TestModelManager:

    def test_model_manager_initialized(self, mock_model_manager):
        """ModelManager should have a recommender initialized."""
        assert mock_model_manager.recommender is not None

    def test_recommender_has_required_methods(self, mock_model_manager):
        """Recommender should expose all required async methods."""
        recommender = mock_model_manager.recommender
        assert hasattr(recommender, "for_user")
        assert hasattr(recommender, "similar_to")
        assert hasattr(recommender, "popular")
        assert hasattr(recommender, "frequently_bought_with")
