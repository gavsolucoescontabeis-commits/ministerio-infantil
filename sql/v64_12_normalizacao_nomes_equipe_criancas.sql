-- V64.12: padrao unico para nomes em todo Cadastro Geral e Equipe
-- Somente os campos "name" dos cadastros sao ajustados; IDs, eventos,
-- sala, presencas, ofertas, talentos e fichas permanecem intactos.
create or replace function public.v64_proper_person_name(p_name text)
returns text language plpgsql immutable set search_path = ''
as $$
declare
  source_name text := regexp_replace(btrim(coalesce(p_name,'')), '[[:space:]]+', ' ', 'g');
  finished text := '';
  letter text;
  is_start boolean := true;
  i int;
begin
  for i in 1..char_length(source_name) loop
    letter:=substr(lower(source_name),i,1);
    if letter ~ '^[[:alpha:]]$' then
      finished:=finished||(case when is_start then upper(letter) else letter end);
      is_start:=false;
    else
      finished:=finished||letter;
      if letter in (' ', '-', chr(39), '’') then is_start:=true; end if;
    end if;
  end loop;
  return finished;
end $$;

create or replace function public.v64_normalize_registry_names(p_state jsonb)
returns jsonb language plpgsql immutable set search_path = ''
as $$
declare
  data_out jsonb := p_state;
  arr jsonb;
  normalized_arr jsonb;
  key_name text;
begin
  if jsonb_typeof(data_out)<>'object' then return data_out; end if;
  foreach key_name in array array['kids','teachers','coords'] loop
    arr:=data_out->key_name;
    if jsonb_typeof(arr)<>'array' then continue; end if;
    select coalesce(jsonb_agg(
      case
        when jsonb_typeof(member.entry)='object' and jsonb_typeof(member.entry->'name')='string'
         and (member.entry->>'name') is distinct from public.v64_proper_person_name(member.entry->>'name')
        then jsonb_set(member.entry,'{name}',to_jsonb(public.v64_proper_person_name(member.entry->>'name')),false)
        else member.entry
      end
      order by member.position),'[]'::jsonb)
      into normalized_arr
    from jsonb_array_elements(arr) with ordinality as member(entry,position);
    if normalized_arr is distinct from arr then
      data_out:=jsonb_set(data_out,array[key_name],normalized_arr,false);
    end if;
  end loop;
  return data_out;
end $$;

create or replace function public.v64_format_app_state_names()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.data:=public.v64_normalize_registry_names(new.data);
  return new;
end $$;

drop trigger if exists trg_v64_registry_name_case on public.app_state_v58;
create trigger trg_v64_registry_name_case
before insert or update of data on public.app_state_v58
for each row execute function public.v64_format_app_state_names();

-- Aplica o padrao aos nomes ja existentes, mantendo o identificador da crianca
-- e incrementando a revisao para atualizar as sessoes abertas.
with changed as (
  select owner_id,public.v64_normalize_registry_names(data) normalized
  from public.app_state_v58
)
update public.app_state_v58 dst
set data=changed.normalized,revision=dst.revision+1,updated_at=now()
from changed
where changed.owner_id=dst.owner_id and dst.data is distinct from changed.normalized;

-- O perfil exibido no cabecalho tambem deve seguir a mesma grafia.
update public.profiles
set display_name=public.v64_proper_person_name(display_name)
where role in ('teacher','coordinator') and display_name is not null
  and display_name is distinct from public.v64_proper_person_name(display_name);
