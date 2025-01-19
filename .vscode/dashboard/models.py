from django.db import models


class chartOptions(models.Model):
    CHART_TYPE_CHOICES = [
        ("Line", "Line"),
        ("Bar", "Bar"),
    ]

    chart_type = models.CharField(max_length=10, choices=CHART_TYPE_CHOICES)

    color = [
            ("blue","blue"),
            ("orange","orange"),
            ("red","red"),
            ("black","black"),
            ("yellow","yellow"),
            ("green","green"),
            ("magenta","magenta"),
            ("lightblue","lightblue"),
            ("purple","purple"),
            ("brown","brown")
            ]

    def __str__(self):
        return self.chart_type