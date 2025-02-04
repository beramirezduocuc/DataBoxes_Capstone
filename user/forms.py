from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm,SetPasswordForm
from main.models import ClienteUsuario
from django import forms

class CreateUserForm(UserCreationForm):
    class Meta:
        model = ClienteUsuario
        fields = ['nombre','email', 'password1', 'password2']
    
    def __init__(self, *args, **kwargs):
        super(CreateUserForm, self).__init__(*args, **kwargs)
        for field_name in self.fields:
            self.fields[field_name].widget.attrs.update({
                'class': 'flex h-[2rem] w-5/6 self-center rounded-lg xl:text-2xl xl:w-[80%] xl:h-[3rem]'
            })
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if ClienteUsuario.objects.filter(email=email).exists():
            raise forms.ValidationError("Este email ya está registrado.")
        return email

    def save(self, commit=True):
        user = super(CreateUserForm, self).save(commit=False)
        user.nombre = self.cleaned_data['nombre']
        user.email = self.cleaned_data['email']  
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
