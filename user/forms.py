from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm
from django.contrib.auth.models import User

class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['email', 'password1', 'password2']
    
    def __init__(self, *args, **kwargs):
        super(CreateUserForm, self).__init__(*args, **kwargs)
        self.fields['email'].widget.attrs.update({'class': 'flex h-[20%] w-5/6 self-center rounded-lg xl:text-2xl xl:w-[80%] xl:h-[15%]'})
        self.fields['password1'].widget.attrs.update({'class': 'flex h-[20%] w-5/6 self-center rounded-lg xl:text-2xl xl:w-[80%] xl:h-[15%]'})
        self.fields['password2'].widget.attrs.update({'class': 'flex h-[20%] w-5/6 self-center rounded-lg xl:text-2xl xl:w-[80%] xl:h-[15%]'})

    #Email = Nombre de usuario. esto es para mantener el sistema default de django. NO optimo. Pero sencillo.
    #Probablemente haya que cambiarlo mas tarde 
    def save(self, commit=True):
        user = super(CreateUserForm, self).save(commit=False)
        user.username = self.cleaned_data['email']  
        if commit:
            user.save()
        return user
    
from django.contrib.auth.forms import SetPasswordForm

class CustomSetPasswordForm(SetPasswordForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['new_password1'].widget.attrs.update({
            'class': 'flex h-[20%] w-5/6 self-center rounded-lg xl:text-2xl xl:w-[80%] xl:h-[15%]'
        })
        self.fields['new_password2'].widget.attrs.update({
            'class': 'flex h-[20%] w-5/6 self-center rounded-lg xl:text-2xl xl:w-[80%] xl:h-[15%]'
        })
