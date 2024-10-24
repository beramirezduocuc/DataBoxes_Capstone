from .models import chartOptions
from django import forms

class chartTypeForm(forms.Form):
    Tipo_de_grafico = forms.ChoiceField(
        choices=chartOptions.CHART_TYPE_CHOICES,
        widget=forms.Select(attrs={
            'class': 'flex w-36 mt-1 py-2 px-3 mx-auto sm:text-sm'
        })
    )
    def clean_Tipo_de_grafico(self):
        data = self.cleaned_data['Tipo_de_grafico']
        return data.lower()  # Devuelve el valor en minúsculas


class CSVUploadForm(forms.Form):
    file = forms.FileField(label="Selecciona un archivo CSV")