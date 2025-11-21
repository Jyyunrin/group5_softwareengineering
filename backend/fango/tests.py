from django.test import TestCase

# Create your tests here.
class CITest(TestCase):
    def test_ci_runs(self):
        self.assertEqual(1, 1)