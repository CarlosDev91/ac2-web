import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-inscricao-conferencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inscricao-conferencia.component.html'
})
export class InscricaoConferenciaComponent implements OnInit {
  inscricaoForm!: FormGroup;
  eventos: string[] = ['TechConf 2025', 'Summit de Inovação', 'Angular World', 'Conexão Dev'];
  modalidades: string[] = ['Presencial', 'Online'];
  tiposIngresso: string[] = ['Padrão', 'VIP', 'Estudante'];
  formSubmitted = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.loadFormData();
    
    // Salvar dados automaticamente quando o formulário é alterado
    this.inscricaoForm.valueChanges.subscribe(() => {
      if (!this.formSubmitted) {
        this.saveFormData();
      }
    });
  }

  initForm(): void {
    this.inscricaoForm = this.fb.group({
      evento: ['', Validators.required],
      modalidade: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataTermino: ['', Validators.required],
      participantes: this.fb.array([])
    }, { validators: this.dataTerminoPosteriorValidator });

    // Adicionar pelo menos um participante no início
    this.adicionarParticipante();
  }

  // Validador personalizado para verificar se a data de término é posterior à data de início
  dataTerminoPosteriorValidator(control: AbstractControl): ValidationErrors | null {
    const dataInicio = control.get('dataInicio')?.value;
    const dataTermino = control.get('dataTermino')?.value;
    
    if (dataInicio && dataTermino) {
      const inicio = new Date(dataInicio);
      const termino = new Date(dataTermino);
      
      if (termino <= inicio) {
        return { dataTerminoInvalida: true };
      }
    }
    
    return null;
  }

  // Validador personalizado para o formato do CPF
  cpfValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;
    if (!cpf) return null;
    
    // Verifica o formato do CPF (XXX.XXX.XXX-XX)
    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfPattern.test(cpf)) {
      return { cpfInvalido: true };
    }
    
    return null;
  }

  // Cria um novo FormGroup para um participante
  criarParticipante(): FormGroup {
    return this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, this.cpfValidator]],
      tipoIngresso: ['', Validators.required]
    });
  }

  // Adiciona um novo participante à lista
  adicionarParticipante(): void {
    this.participantes.push(this.criarParticipante());
  }

  // Remove um participante da lista pelo índice
  removerParticipante(index: number): void {
    this.participantes.removeAt(index);
    this.saveFormData();
  }

  // Salva os dados do formulário no localStorage
  saveFormData(): void {
    localStorage.setItem('inscricaoConferenciaData', JSON.stringify(this.inscricaoForm.value));
  }

  // Carrega os dados do formulário do localStorage
  loadFormData(): void {
    const savedData = localStorage.getItem('inscricaoConferenciaData');
    if (savedData) {
      const formData = JSON.parse(savedData);
      
      // Preenche os campos principais
      this.inscricaoForm.patchValue({
        evento: formData.evento,
        modalidade: formData.modalidade,
        dataInicio: formData.dataInicio,
        dataTermino: formData.dataTermino
      });
      
      // Limpa o array de participantes padrão
      while (this.participantes.length !== 0) {
        this.participantes.removeAt(0);
      }
      
      // Adiciona os participantes salvos
      if (formData.participantes && formData.participantes.length > 0) {
        formData.participantes.forEach((participante: any) => {
          const participanteGroup = this.criarParticipante();
          participanteGroup.patchValue(participante);
          this.participantes.push(participanteGroup);
        });
      } else {
        // Se não houver participantes, adiciona um em branco
        this.adicionarParticipante();
      }
    }
  }

  // Limpa os dados do formulário do localStorage
  clearFormData(): void {
    localStorage.removeItem('inscricaoConferenciaData');
  }

  // Manipula o envio do formulário
  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.inscricaoForm.valid) {
      console.log(this.inscricaoForm.value);
      this.clearFormData();
      this.inscricaoForm.reset();
      this.formSubmitted = false;
      
      // Reinicia o formulário com um participante em branco
      while (this.participantes.length !== 0) {
        this.participantes.removeAt(0);
      }
      this.adicionarParticipante();
      
      alert('Inscrição realizada com sucesso!');
    } else {
      // Marca todos os campos como touched para mostrar validações
      this.markFormGroupTouched(this.inscricaoForm);
      alert('Por favor, corrija os erros no formulário antes de enviar.');
    }
  }

  // Marca todos os campos do formulário como touched
  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  // Getters para facilitar o acesso aos controles do formulário no template
  get evento() { return this.inscricaoForm.get('evento'); }
  get modalidade() { return this.inscricaoForm.get('modalidade'); }
  get dataInicio() { return this.inscricaoForm.get('dataInicio'); }
  get dataTermino() { return this.inscricaoForm.get('dataTermino'); }
  get participantes() { return this.inscricaoForm.get('participantes') as FormArray; }
}