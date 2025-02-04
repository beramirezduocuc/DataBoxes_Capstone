from django.contrib.auth.forms import UserCreationForm, SetPasswordForm
from main.models import usuario
from django import forms

class CreateUserForm(UserCreationForm):
    class Meta:
        model = usuario
        fields = ['nombre', 'correo', 'password1', 'password2']  # Usamos 'correo' en lugar de 'email'
    
    def __init__(self, *args, **kwargs):
        super(CreateUserForm, self).__init__(*args, **kwargs)
        for field_name in self.fields:
            self.fields[field_name].widget.attrs.update({
                'class': 'flex h-[2rem] w-5/6 self-center rounded-lg xl:text-2xl xl:w-[80%] xl:h-[3rem]'
            })
    
    def clean_correo(self):  # Cambié el nombre a 'correo' aquí también
        correo = self.cleaned_data.get('correo')
        if usuario.objects.filter(correo=correo).exists():  # Aseguramos que esté usando 'correo'
            raise forms.ValidationError("Este correo ya está registrado.")
        return correo

    def save(self, commit=True):
        user = super(CreateUserForm, self).save(commit=False)
        user.nombre = self.cleaned_data['nombre']
        user.correo = self.cleaned_data['correo']  # Usamos 'correo' aquí también
        if commit:
            user.save()
        return user

class CustomSetPasswordForm(SetPasswordForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['new_password1'].widget.attrs.update({
            'class': 'flex h-[2rem] w-5/6 self-center rounded-lg xl:text-2xl xl:w-[80%] xl:h-[3rem]'
        })
        self.fields['new_password2'].widget.attrs.update({
            'class': 'flex h-[2rem] w-5/6 self-center rounded-lg xl:text-2xl xl:w-[80%] xl:h-[3rem]'
        })
