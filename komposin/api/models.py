from django.db import models

# Create your models here.
class Product(models.Model):
    user_id = models.IntegerField()
    product_name = models.CharField(max_length=255)
    created = models.DateTimeField()
    days_expired = models.IntegerField()
    qty = models.DecimalField(max_digits=10, decimal_places=2)
    uom = models.CharField(max_length=50)
    due_date = models.DateTimeField()

    class Meta:
        db_table = 'm_product'

    def __str__(self):
        return self.product_name