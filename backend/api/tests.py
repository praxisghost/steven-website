from django.db import IntegrityError
from django.test import TestCase
from rest_framework.test import APIClient

from .models import ContactMessage, NewsletterSubscriber, PageView


class HealthEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_returns_ok_and_db_connected(self):
        resp = self.client.get("/api/health/")
        self.assertEqual(resp.status_code, 200)
        body = resp.json()
        self.assertEqual(body["status"], "ok")
        self.assertEqual(body["database"], "connected")
        self.assertIn("engine", body)
        self.assertIn("time", body)


class ModelTests(TestCase):
    def test_pageview_autosets_timestamp(self):
        pv = PageView.objects.create()
        self.assertIsNotNone(pv.visited_at)

    def test_contact_message_roundtrip(self):
        msg = ContactMessage.objects.create(
            name="Ada", email="ada@example.com", message="hello"
        )
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertIsNotNone(msg.sent_at)
        self.assertIn("ada@example.com", str(msg))

    def test_newsletter_email_is_unique(self):
        NewsletterSubscriber.objects.create(email="dup@example.com")
        with self.assertRaises(IntegrityError):
            NewsletterSubscriber.objects.create(email="dup@example.com")


class ViewsEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_views_increments_and_returns_total(self):
        r1 = self.client.post("/api/views/")
        self.assertEqual(r1.status_code, 200)
        self.assertEqual(r1.json()["views"], 1)
        r2 = self.client.post("/api/views/")
        self.assertEqual(r2.json()["views"], 2)
        self.assertEqual(PageView.objects.count(), 2)


class ContactEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_valid_contact_is_stored(self):
        resp = self.client.post(
            "/api/contact/",
            {"name": "Ada", "email": "ada@example.com", "message": "hi"},
            format="json",
        )
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json()["ok"])
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_missing_fields_rejected(self):
        resp = self.client.post(
            "/api/contact/", {"name": "Ada"}, format="json"
        )
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_invalid_email_rejected(self):
        resp = self.client.post(
            "/api/contact/",
            {"name": "Ada", "email": "nope", "message": "hi"},
            format="json",
        )
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(ContactMessage.objects.count(), 0)


class NewsletterEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_signup_is_idempotent(self):
        for _ in range(2):
            resp = self.client.post(
                "/api/newsletter/", {"email": "sub@example.com"}, format="json"
            )
            self.assertEqual(resp.status_code, 200)
            self.assertTrue(resp.json()["ok"])
        self.assertEqual(NewsletterSubscriber.objects.count(), 1)

    def test_invalid_email_rejected(self):
        resp = self.client.post(
            "/api/newsletter/", {"email": "bad"}, format="json"
        )
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(NewsletterSubscriber.objects.count(), 0)


class CatchAllTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_unknown_api_path_returns_json_404(self):
        resp = self.client.get("/api/does-not-exist/")
        self.assertEqual(resp.status_code, 404)
        self.assertEqual(resp.json()["error"], "Not found")
