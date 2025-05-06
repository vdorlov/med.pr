-- Функция для получения всех амбулаторных услуг
create or replace function get_all_ambulatory_services()
returns table (
    id bigint,
    section text,
    subsection_1 text,
    subsection_2 text,
    kod_eru text,
    name_eru text,
    price numeric
)
language sql
as $$
    select id, section, subsection_1, subsection_2, kod_eru, name_eru, price
    from ambulatory_stationary_services;
$$;

-- Функция для получения всех лабораторных услуг
create or replace function get_all_laboratory_services()
returns table (
    id bigint,
    section_lab text,
    subsection_1_lab text,
    subsection_2_lab text,
    kod_eru_lab text,
    name_eru_lab text,
    price_lab numeric
)
language sql
as $$
    select id, section_lab, subsection_1_lab, subsection_2_lab, kod_eru_lab, name_eru_lab, price_lab
    from laboratory_services;
$$; 